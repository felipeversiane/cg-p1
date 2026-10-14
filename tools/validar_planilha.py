"""Valida tools/mvp.py contra a PLANILHA real (recalculada pelo LibreOffice, numa cópia).

Para cada caso: preenche a aba Calculadora, recalcula e compara G34 (visibilidade) e a MVP (G13:J16).
Uso: python3 tools/validar_planilha.py   (requer soffice/libreoffice)
"""
import sys, re, zipfile, subprocess, os, html, tempfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import mvp
SRC = os.path.join(ROOT, 'MVP_Excel_corrigido.xlsx')
W = tempfile.mkdtemp(prefix='valplanilha_')
def setcells(xml, vals):
    for ref,v in vals.items():
        pat=re.compile(r'<c r="%s"([^>]*?)(/>|>.*?</c>)'%ref, re.S)
        m=pat.search(xml); assert m, ref
        attrs=re.sub(r'\s+t="[^"]*"','',m.group(1))
        if isinstance(v,str): new='<c r="%s"%s t="inlineStr"><is><t>%s</t></is></c>'%(ref,attrs,v)
        else: new='<c r="%s"%s><v>%s</v></c>'%(ref,attrs,repr(float(v)))
        xml=xml[:m.start()]+new+xml[m.end():]
    return xml
def run_sheet(name, pts, rot, esc, desloc, eye, target, up, fov, tipo, Wd, H, near, far):
    vals={}
    for i,p in enumerate(pts):
        for j,c in enumerate('CDE'): vals[f'{c}{8+i}']=p[j]
    vals.update({'C13':rot[0],'C14':rot[1],'C15':rot[2],'C19':esc[0],'C20':esc[1]})
    for j,c in enumerate('CDE'):
        vals[f'{c}25']=desloc[j]; vals[f'{c}30']=eye[j]; vals[f'{c}33']=up[j]
    vals['C31']=target
    vals.update({'C37':fov,'E37':tipo,'C38':Wd,'E38':H,'C39':near,'E39':far})
    d=f'{W}/{name}'; os.makedirs(d,exist_ok=True)
    out=f'{d}/in.xlsx'
    zin=zipfile.ZipFile(SRC); zout=zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)
    for it in zin.infolist():
        data=zin.read(it.filename)
        if it.filename.startswith('xl/worksheets/sheet'):
            t=data.decode('utf8')
            if it.filename.endswith('sheet1.xml'): t=setcells(t,vals)
            # remove valores em cache das fórmulas para forçar o recálculo
            t=re.sub(r'(<c [^>]*?)\s+t="(?:str|b|e)"([^>]*>\s*<f)',r'\1\2',t)
            t=re.sub(r'(<f[^>]*>.*?</f>)\s*<v>.*?</v>',r'\1',t,flags=re.S)
            data=t.encode('utf8')
        zout.writestr(it,data)
    zout.close()
    subprocess.run(['soffice','--headless','--convert-to','ods','--outdir',d,out],capture_output=True,timeout=120)
    subprocess.run(['soffice','--headless','--convert-to','xlsx:Calc MS Excel 2007 XML','--outdir',d+'/o',d+'/in.ods'],capture_output=True,timeout=120)
    z=zipfile.ZipFile(d+'/o/in.xlsx'); x=z.read('xl/worksheets/sheet1.xml').decode('utf8')
    ss=[html.unescape(re.sub(r'<[^>]+>','',m)) for m in re.findall(r'<si>(.*?)</si>',z.read('xl/sharedStrings.xml').decode('utf8'),re.S)]
    def cell(ref):
        m=re.search(r'<c r="%s"([^>]*?)>(.*?)</c>'%ref,x,re.S)
        if not m: return None
        v=re.search(r'<v>(.*?)</v>',m.group(2))
        if not v: return None
        return ss[int(v.group(1))] if 't="s"' in m.group(1) else (v.group(1) if 't="str"' in m.group(1) else float(v.group(1)))
    mvpm=[[cell(f'{c}{r}') for c in 'GHIJ'] for r in range(13,17)]
    return cell('G34'), mvpm
def py(pts,rot,esc,desloc,eye,target,up,fov,tipo,Wd,H,near,far):
    mvp.ESCALA_PIVO=None
    r=mvp.run(pts,rot=rot,escala=esc,desloc=desloc,eye=eye,target=target,up=up,fov=fov,tipo=tipo,largura=Wd,altura=H,near=near,far=far,verbose=False)
    return r['estado'], r['MVP']
CASOS={
 '2024estudo_origem':([(-2.5,-2.5,2),(0,3,2),(-2.5,2.5,2)],('Z',60,'Centro'),(2,'Origem'),(0,0,0),(3,32,1),'Centro',(0,1,0),60,'Vertical',800,600,1,25),
 '2024estudo_centro':([(-2.5,-2.5,2),(0,3,2),(-2.5,2.5,2)],('Z',60,'Centro'),(2,'Centro'),(0,0,0),(3,32,1),'Centro',(0,1,0),60,'Vertical',800,600,1,25),
 '2024p1_origem':([(2,3,3),(-2,0,3),(-3,-2,3)],('Z',60,'Centro'),(2,'Origem'),(0,0,0),(3,0,15),'Centro',(0,1,0),120,'Horizontal',2048,1024,1,10),
 '2024p1_centro':([(2,3,3),(-2,0,3),(-3,-2,3)],('Z',60,'Centro'),(2,'Centro'),(0,0,0),(3,0,15),'Centro',(0,1,0),120,'Horizontal',2048,1024,1,10),
 '2024p1_far14':([(2,3,3),(-2,0,3),(-3,-2,3)],('Z',60,'Centro'),(2,'Centro'),(0,0,0),(3,0,15),'Centro',(0,1,0),120,'Horizontal',2048,1024,1,14),
 '2025T':([(2,6,3),(6,3,2),(3,2,6)],('Z',45,'Origem'),(0.5,'Origem'),(0,0,0),(0,-0.5,-5),'Origem',(0,1,0),45,'Vertical',1024,768,1,6),
 '2025U':([(-3,-6,-2),(-6,-2,-3),(-2,-3,-6)],('X',-60,'Centro'),(2,'Centro'),(2,0,0),(0,-0.5,-5),'Origem',(0,1,0),45,'Vertical',1024,768,1,6),
 '2025U_recuado':([(-3,-6,-2),(-6,-2,-3),(-2,-3,-6)],('X',-60,'Centro'),(2,'Centro'),(2,0,0),(0,0,-25),'Origem',(0,1,0),45,'Vertical',1024,768,1,40),
 'parcial_7_4':([(2,3,4),(-2,7,4),(-3,-2,4)],('Z',60,'Centro'),(2,'Centro'),(0,0,0),(3,0,15),'Centro',(0,1,0),120,'Horizontal',2048,1024,1,10),
}
FALHAS=[]
trad={'Dentro do volume':'DENTRO','Parcialmente no volume':'PARCIALMENTE','Fora do volume':'FORA'}
for n,args in CASOS.items():
    ps,pm=py(*args)
    ss,sm=run_sheet(n,*args)
    ok_state = trad.get(ss,ss) in ps
    diff=max(abs(a-b) for ra,rb in zip(pm,sm) for a,b in zip(ra,rb)) if all(isinstance(v,float) for r in sm for v in r) else None
    if diff is None or diff>1e-6 or not ok_state: FALHAS.append(n)
    print(f"{n:20s} planilha={ss!s:26s} script={ps.split(' ')[0]:13s} estado_ok={ok_state}  max|ΔMVP|={diff}")
print('OK: planilha e script concordam em todos os casos.' if not FALHAS else 'DIVERGÊNCIAS: '+', '.join(FALHAS))
sys.exit(1 if FALHAS else 0)
